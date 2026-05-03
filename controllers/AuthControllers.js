const moment = require("moment")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })
const AuthModel = require("../models/AuthModel")
const SecurityHandlers = require("../helpers/SecurityHandlers")

let PermissionModel = null
try {
    PermissionModel = require("../models/PermissionModel")
} catch (_err) {
    PermissionModel = null
}

const AuthControllers = (module.exports = {
    Login: async function (req, res) {
        var apiResult = {}
        try {
            var { email } = req.body
            const user = await AuthModel.GetByEmail(email)
                .then(({ rows }) => rows[0])
                .catch((err) => {
                    return { success: false, error: err }
                })

            if (!user || user.success == false) {
                const errorMessage =
                    user?.error?.message ||
                    user?.error?.detail ||
                    "Incorrect username or password"

                apiResult = {
                    success: false,
                    message: errorMessage
                }
            } else {
                const token = await SecurityHandlers.generateToken({ email })

                const id_m_employee = user.id_m_employee
                let permissions = []
                if (PermissionModel && typeof PermissionModel.ListByEmployeeId === "function") {
                    permissions = await PermissionModel.ListByEmployeeId(id_m_employee)
                }

                apiResult = {
                    success: true,
                    message: "Operation Success",
                    data: { user, token, permissions }
                    // data: { token }
                }
            }
        } catch (error) {
            console.warn("error :", error)
            apiResult = {
                success: false,
                message: "Incorrect username or password",
                error: error.message
            }
        }
        res.status(200).json(apiResult)
    },
    Create: async function (req, res) {
        var apiResult = {}
        try {
            var {
                id_m_client, //
                id_m_employee,
                fullname,
                email_address,
                password,
                status,
                created_by,
                updated_by
            } = req.body

            const checkUser = await AuthModel.GetByEmail(email_address).then(({ rows }) => rows[0])
            if (checkUser) throw "Akun sudah terdaftar"

            let _dtInsert = {
                id_m_client, //
                id_m_employee,
                fullname,
                email_address,
                password,
                status,
                created_by,
                updated_by
            }
            let dtInsert = await AuthModel.Create(_dtInsert)
            if (dtInsert) {
                apiResult = {
                    success: true,
                    message: "Operation Success"
                }
            }
        } catch (error) {
            console.warn("error :", error)
            apiResult = {
                success: false,
                message: error.toString()
            }
        }
        res.status(200).json(apiResult)
    },
    Profile: async function (req, res) {
        var apiResult = {}
        try {
            var { id } = req.user

            const getProfile = await AuthModel.GetById(id).then(({ rows }) => rows[0])
            // console.log("profile: " + getProfile)
            apiResult = {
                success: true,
                message: "Operation Success",
                data: getProfile
            }
        } catch (error) {
            console.warn("error :", error)
            apiResult = {
                success: false,
                message: "Operation Fail"
            }
        }
        res.status(200).json(apiResult)
    },
    Logout: async function (req, res) {
        var apiResult = {}
        try {
            var { id } = req.user
            // console.log("req.user.id :", id)
            await AuthModel.DeleteRememberToken(id)
            apiResult = {
                success: true,
                message: "Operation Success"
            }
        } catch (error) {
            console.warn("error :", error)
            apiResult = {
                success: false,
                message: "Operation Fail"
            }
        }
        res.status(200).json(apiResult)
    },
    Update: async function (req, res) {
        var apiResult = {}
        try {
            var {
                id_m_user, //
                id_m_client,
                password,
                updated_at,
                updated_by
            } = req.body

            const getPackage = await AuthModel.GetById(id_m_user).then(({ rows }) => rows[0])
            if (!getPackage) throw "Data tidak ditemukan"

            let _dtupdate = {
                id_m_user, //
                id_m_client,
                password,
                updated_at,
                updated_by
            }
            const dtUpdate = await AuthModel.UpdatePassword(_dtupdate)
            if (dtUpdate) {
                const getPackage = await AuthModel.GetById(id_m_user).then(({ rows }) => rows[0])
                if (!getPackage) throw "Update Gagal, Data tidak ditemukan"

                apiResult = {
                    success: true,
                    message: "Operation Success",
                    data: getPackage
                }
            }
        } catch (error) {
            apiResult = {
                success: false,
                message: error.toString()
            }
        }
        res.status(200).json(apiResult)
    },
    login: async function (req, res) {
        return AuthControllers.Login(req, res)
    },
    register: async function (req, res) {
        return AuthControllers.Create(req, res)
    },
    profile: async function (req, res) {
        return AuthControllers.Profile(req, res)
    },
    logout: async function (req, res) {
        return AuthControllers.Logout(req, res)
    },
    update: async function (req, res) {
        return AuthControllers.Update(req, res)
    },
    refreshToken: async function (req, res) {
        try {
            const email = req?.user?.email || req?.body?.email
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" })
            }
            const token = SecurityHandlers.generateToken({ email })
            return res.status(200).json({
                success: true,
                message: "Operation Success",
                data: { token }
            })
        } catch (error) {
            return res.status(200).json({
                success: false,
                message: "Operation Fail",
                error: error.message
            })
        }
    }
})
