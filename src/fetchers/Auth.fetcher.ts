import { apiRoute } from "../utils/apiRoute"

const loginFunc = async (username: string, pincode: string) => {
    let a = await fetch(apiRoute + "/auth/login", {
        body: JSON.stringify({ username, pincode }),
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let b = await a.json()
    return b
}




export { loginFunc }