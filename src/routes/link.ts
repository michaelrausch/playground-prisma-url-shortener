import express, { Request, Response } from "express"
const { PrismaClient, Prisma } = require("@prisma/client")
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient()

function getLinkGeneratorRoutes() {
    const router = express.Router()

    router.post('/create', 
        body('url').exists(), 
        body('slug').isLength({ min: 5 }), 
        createShortLink)

    router.get('/:slug', redirectToShortLink)

    return router
}

async function createShortLink(req: Request, res: Response) {
    const body = req.body

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "E0003", "Validation Failed")
    }

    try {
        await prisma.link.create({
            data: {
                shortLink: body.slug,
                url: body.url
            }
        })
    }
    catch(error) {
        // Unique constraint failed, see prisma.io/docs/reference/api-reference/error-reference
        // @ts-ignore
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return errorResponse(res, 400, "E0001", "URL slug already exists")
        }
        else {
            return errorResponse(res, 500, "E0002", "Unknown error")
        }
    }

    return createdResponse(res, body.slug)
}

async function redirectToShortLink(req: Request, res: Response) {
    const slug = req.params.slug

    const result = await prisma.link.findUnique({
        where: {
            shortLink: slug
        }
    })

    if (result == null) {
        return res.status(404).send("")
    }

    res.redirect(result.url)
}

function errorResponse(res: Response, responsecode: number, errorCode: string, message: string) {
    return res.status(responsecode).json({
        success: false,
        error: {
            code: errorCode,
            message: message
        }
    })
}

function createdResponse(res: Response, slug: string) {
    return res.status(200).json({
        success: true,
        error: {
            code: "",
            message: ""
        },
        result: {
            url: process.env.BASE_URI + slug
        }
    })
}

export { getLinkGeneratorRoutes }