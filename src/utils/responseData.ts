export const responseData = (res:any, message:string, data:any, statusCode:number) => {
    return res.status(statusCode).json({
        message,
        content: data,
        date: new Date()
    })
}