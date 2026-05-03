var dbPg = require("../library/dbConnection")
var Promise = require("bluebird")

const AuthModel = (module.exports = {
    GetById: async function (id) {
        console.log("GetById:" + id)
        return new Promise((resolve, reject) => {
            const secretKey = process.env.SECRET_KEY

            if (!secretKey) {
                reject(new Error("Secret key not found in .env. Please configure it."))
                return
            }

            // var query = `
            //     select
            //         mu.id_m_user as id,
            //         pgp_sym_decrypt(me.employee_number::bytea, $1) as employee_number,
            //         pgp_sym_decrypt(me.first_name::bytea, $1) as first_name,
            //         pgp_sym_decrypt(me.last_name::bytea, $1) as last_name,
            //         pgp_sym_decrypt(me.email_address::bytea, $1) as email_address,
            //         pgp_sym_decrypt(me.phone_number::bytea, $1) as phone_number,
            //         mea.address,
            //         mr1.nmProvinsiKel,
            //         mr2.nmKotamadyaKel,
            //         mr3.nmKecamatanKel,
            //         mr4.nmKelurahan,
            //         mea.postcode,
            //         me.gender,
            //         mp.position,
            //         mei.img,
            //         mo.organization_name,
            //         mc.company_name,
            //         me.updated_at,
            //         mc.company_email_domain
            //     from
            //         m_users mu
            //     left join m_employees me on
            //         me.id_m_employee = mu.id_m_employee
            //     left join m_employee_addresses mea on
            //         mea.id_m_employee = me.id_m_employee
            //     left join m_employee_images mei on
            //         mei.id_m_employee = me.id_m_employee
            //     left join m_companies mc on
            //         mc.id_m_companies = me.id_m_companies
            //     left join m_region mr1 on
            //         mr1.kodeProv = mea.id_m_region_prov
            //     left join m_region mr2 on
            //         mr2.kodeKab = mea.id_m_region_kab
            //     left join m_region mr3 on
            //         mr3.kodeKec = mea.id_m_region_kec
            //     left join m_region mr4 on
            //         mr4.kodeKel = mea.id_m_region_kel
            //     left join m_positions mp on
            //         mp.id_m_positions = me.id_m_positions
            //     left join m_organizations mo on
            //         mo.id_m_organizations = mp.id_m_organizations
            //     where
            //         mu.id_m_user = $2
            //     group by
            //         mu.id_m_user,
            //         me.employee_number,
            //         me.first_name,
            //         me.last_name,
            //         mea.address,
            //         mr1.nmProvinsiKel,
            //         mr2.nmKotamadyaKel,
            //         mr3.nmKecamatanKel,
            //         mr4.nmKelurahan,
            //         mea.postcode,
            //         me.email_address,
            //         me.phone_number,
            //         me.gender,
            //         mp.position,
            //         mei.img,
            //         mo.organization_name,
            //         mc.company_name,
            //         me.updated_at,
            //         mc.company_email_domain;
            // `
            var query = `
                select
                    mu.id_m_user as id,
                    pgp_sym_decrypt(me.employee_number::bytea, $1) as employee_number,
                    pgp_sym_decrypt(me.first_name::bytea, $1) as first_name,
                    pgp_sym_decrypt(me.last_name::bytea, $1) as last_name,
                    pgp_sym_decrypt(me.email_address::bytea, $1) as email_address,
                    pgp_sym_decrypt(me.phone_number::bytea, $1) as phone_number,
                    mea.address,
                    mr1.nmProvinsiKel,
                    mr2.nmKotamadyaKel,
                    mr3.nmKecamatanKel,
                    mr4.nmKelurahan,
                    mea.postcode,
                    me.gender,
                    mp.position,
                    mei.img,
                    mo.organization_name,
                    mc.company_name,
                    me.updated_at,
                    mc.company_email_domain
                from m_users mu
                left join m_employees me on me.id_m_employee = mu.id_m_employee
                left join m_employee_addresses mea on mea.id_m_employee = me.id_m_employee
                left join m_employee_images mei on mei.id_m_employee = me.id_m_employee
                left join m_companies mc on mc.id_m_companies = me.id_m_companies
                left join m_region mr1 on mr1.kodeProv = mea.id_m_region_prov
                left join m_region mr2 on mr2.kodeKab = mea.id_m_region_kab
                left join m_region mr3 on mr3.kodeKec = mea.id_m_region_kec
                left join m_region mr4 on mr4.kodeKel = mea.id_m_region_kel
                left join m_positions mp on mp.id_m_positions = me.id_m_positions
                left join m_organizations mo on mo.id_m_organizations = mp.id_m_organizations
                where mu.id_m_user = $2
                limit 1
            `
            dbPg.query(query, [secretKey, id], function (err, result) {
                console.log("result", result)
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        rowCount: result.length,
                        rows: result.rows
                    })
                }
            })
        })
    },
    GetByEmail: async function (email) {
        const secretKey = process.env.SECRET_KEY
        const normalizedEmail = String(email || "").trim().toLowerCase()

        var queryPlain = `
            select
                mu.id_m_user as id,
                mu.id_m_employee,
                mu.password,
                mu.fullname,
                mu.type,
                mc2.id_m_module,
                me.*,
                me.employee_number,
                me.first_name,
                me.last_name,
                me.email_address,
                me.phone_number,
                mc.*
            from
                m_users mu
            left join m_employees me on
                me.id_m_employee = mu.id_m_employee
            left join m_companies mc on
                mc.id_m_companies = me.id_m_companies
            left join m_clients mc2 on
                mc2.id_m_companies = me.id_m_companies
            where
                mu.status = 1
                and me.status = 1
                and lower(me.email_address) = $1
            limit 1
        `

        const plainResult = await dbPg.query(queryPlain, [normalizedEmail])
        if (plainResult.rowCount > 0) {
            return {
                rowCount: plainResult.rowCount,
                rows: plainResult.rows
            }
        }

        if (!secretKey) {
            return {
                rowCount: 0,
                rows: []
            }
        }

        var queryEncrypted = `
            select
                mu.id_m_user as id,
                mu.id_m_employee,
                mu.password,
                pgp_sym_decrypt(mu.fullname::bytea, $1) as fullname,
                mu.type,
                mc2.id_m_module,
                me.*,
                pgp_sym_decrypt(me.employee_number::bytea, $1) as employee_number,
                pgp_sym_decrypt(me.first_name::bytea, $1) as first_name,
                pgp_sym_decrypt(me.last_name::bytea, $1) as last_name,
                pgp_sym_decrypt(me.email_address::bytea, $1) as email_address,
                pgp_sym_decrypt(me.phone_number::bytea, $1) as phone_number,
                mc.*
            from
                m_users mu
            left join m_employees me on
                me.id_m_employee = mu.id_m_employee
            left join m_companies mc on
                mc.id_m_companies = me.id_m_companies
            left join m_clients mc2 on
                mc2.id_m_companies = me.id_m_companies
            where
                mu.status = 1
                and me.status = 1
                and lower(pgp_sym_decrypt(me.email_address::bytea, $1)) = $2
            limit 1
        `

        try {
            const encryptedResult = await dbPg.query(queryEncrypted, [secretKey, normalizedEmail])
            return {
                rowCount: encryptedResult.rowCount,
                rows: encryptedResult.rows
            }
        } catch (err) {
            const isDecryptError =
                err.code === "39000" ||
                String(err.message || "")
                    .toLowerCase()
                    .includes("wrong key or corrupt data")

            if (isDecryptError) {
                return {
                    rowCount: 0,
                    rows: []
                }
            }

            throw err
        }
    },
    Create: async function (data, encryptFields = ["fullname", "email_address"]) {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.SECRET_KEY
            let col = []
            let val = []
            let valSql = []
            let i = 1
            for (let d in data) {
                col.push(`"${d}"`)
                if (encryptFields.includes(d)) {
                    valSql.push(`pgp_sym_encrypt($${i}, '${secretKey}')`)
                } else {
                    valSql.push(`$${i}`)
                }
                val.push(data[d])
                i++
            }
            const query = `
                INSERT INTO m_users (${col.join(", ")})
                VALUES (${valSql.join(", ")})
                RETURNING *;
            `
            dbPg.query(query, val, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        rowCount: result.length,
                        rows: result.rows
                    })
                }
            })
        })
    },
    UpdateRememberToken: async function (rememberToken, id) {
        return new Promise((resolve, reject) => {
            var query = "UPDATE m_users SET remember_token=$1 WHERE id_m_user=$2"
            dbPg.query(query, [rememberToken, id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        rowCount: result.length,
                        rows: result.rows
                    })
                }
            })
        })
    },
    DeleteRememberToken: async function (id) {
        return new Promise((resolve, reject) => {
            var query = `UPDATE m_users SET remember_token=null WHERE id_m_user=$1`
            dbPg.query(query, [id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        rowCount: result.length,
                        rows: result.rows
                    })
                }
            })
        })
    },
    UpdatePassword: async function (data) {
        return new Promise((resolve, reject) => {
            var col = []
            var val = []

            var i = 1
            for (var d in data) {
                if (d !== "id_m_user" && d !== "id_m_client") {
                    col.push(d + "=$" + i)
                    val.push(data[d])
                    i++
                }
            }
            val.push(data.id_m_user, data.id_m_client)
            var query = `
                UPDATE m_users 
                SET ${col.join(", ")}
                WHERE id_m_user=$${i} AND id_m_client=$${i + 1}
            `
            dbPg.query(query, val, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        rowCount: result.length,
                        rows: result.rows
                    })
                }
            })
        })
    }
})
