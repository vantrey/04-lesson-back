import {Request, Response, Router} from 'express'
import {authValidationMiddleware, loginValidation, passwordValidation} from '../middlewares/input-validation-middleware'
import {authService} from '../bll-domain/auth-service'

export const authRouter = Router({})

authRouter.post('/login', loginValidation, passwordValidation, authValidationMiddleware, async (req: Request, res: Response) => {
    const login = req.body.login
    const password = req.body.password
    const result = await authService.checkCredentials(login, password)

    if (!result) {
        res.sendStatus(401)
        return
    }

    res.cookie('refreshToken', result, {
        maxAge: 100000,
        httpOnly: true,
        secure: true,
    });

    res.status(200).send({accessToken: result})
})