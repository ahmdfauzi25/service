const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const db = require("../library/dbConnection");

const TARGET_EMAIL = "zora@admin.co.id";
const TARGET_PASSWORD = "1";
const TARGET_FULLNAME = "Zora Admin";
const DEFAULT_PHONE = "0000000000";
const DEFAULT_GENDER = "F";

async function findEmployeeByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const secretKey = process.env.SECRET_KEY;

  if (secretKey) {
    const encryptedQuery = `
      SELECT id_m_employee, id_m_client, id_m_companies, status
      FROM m_employees
      WHERE lower(pgp_sym_decrypt(email_address::bytea, $1)) = $2
      LIMIT 1
    `;

    try {
      const result = await db.query(encryptedQuery, [secretKey, normalizedEmail]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      const isDecryptError =
        err.code === "39000" ||
        String(err.message || "").toLowerCase().includes("wrong key or corrupt data");

      if (!isDecryptError) {
        throw err;
      }
    }
  }

  const plainQuery = `
    SELECT id_m_employee, id_m_client, id_m_companies, status
    FROM m_employees
    WHERE lower(email_address) = $1
    LIMIT 1
  `;
  const plainResult = await db.query(plainQuery, [normalizedEmail]);
  return plainResult.rows[0] || null;
}

async function findDefaultCompanyId() {
  const primary = await db.query(
    `
      SELECT id_m_companies
      FROM m_companies
      WHERE status = 1
      ORDER BY id_m_companies ASC
      LIMIT 1
    `
  );

  if (primary.rows[0]?.id_m_companies) {
    return primary.rows[0].id_m_companies;
  }

  const fallback = await db.query(
    `
      SELECT id_m_companies
      FROM m_companies
      ORDER BY id_m_companies ASC
      LIMIT 1
    `
  );

  return fallback.rows[0]?.id_m_companies || null;
}

async function findClientIdByCompanyId(idMCompanies) {
  if (!idMCompanies) return null;

  const query = `
    SELECT id_m_client
    FROM m_clients
    WHERE id_m_companies = $1
    ORDER BY id_m_client ASC
    LIMIT 1
  `;

  const result = await db.query(query, [idMCompanies]);
  return result.rows[0]?.id_m_client || null;
}

async function createEmployeeIfMissing() {
  const existingEmployee = await findEmployeeByEmail(TARGET_EMAIL);
  if (existingEmployee) {
    if (String(existingEmployee.status) !== "1") {
      await db.query(
        `
          UPDATE m_employees
          SET status = 1,
              updated_at = NOW()
          WHERE id_m_employee = $1
        `,
        [existingEmployee.id_m_employee]
      );
    }
    return existingEmployee;
  }

  const idMCompanies = await findDefaultCompanyId();
  const idMClient = await findClientIdByCompanyId(idMCompanies);
  const emailPrefix = TARGET_EMAIL.split("@")[0] || "zora";

  const insertedEmployee = await db.query(
    `
      INSERT INTO m_employees (
        id_m_client,
        id_m_companies,
        employee_number,
        first_name,
        last_name,
        email_address,
        phone_number,
        gender,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        1,
        NOW(),
        NOW()
      )
      RETURNING id_m_employee, id_m_client, id_m_companies, status
    `,
    [
      idMClient,
      idMCompanies,
      `EMP-${Date.now()}`,
      "Zora",
      "Admin",
      TARGET_EMAIL,
      DEFAULT_PHONE,
      DEFAULT_GENDER,
    ]
  );

  return insertedEmployee.rows[0];
}

async function upsertZoraAccount() {
  const employee = await createEmployeeIfMissing();

  const existingUser = await db.query(
    "SELECT id_m_user FROM m_users WHERE id_m_employee = $1 OR lower(email_address) = $2 LIMIT 1",
    [employee.id_m_employee, TARGET_EMAIL.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    await db.query(
      `
        UPDATE m_users
        SET password = $1,
            fullname = $2,
            email_address = $3,
            id_m_employee = $4,
            type = 'OWNER',
            status = 1,
            updated_at = NOW()
        WHERE id_m_user = $5
      `,
      [
        TARGET_PASSWORD,
        TARGET_FULLNAME,
        TARGET_EMAIL,
        employee.id_m_employee,
        existingUser.rows[0].id_m_user,
      ]
    );

    console.log("Account sudah ada, password diupdate ke 1:", existingUser.rows[0].id_m_user);
    return;
  }

  const idMClient = employee.id_m_client || (await findClientIdByCompanyId(employee.id_m_companies));

  const insertQuery = `
    INSERT INTO m_users (
      id_m_client,
      id_m_employee,
      fullname,
      email_address,
      password,
      type,
      status,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      'OWNER',
      1,
      NULL,
      NULL,
      NOW(),
      NOW()
    )
    RETURNING id_m_user
  `;

  const inserted = await db.query(insertQuery, [
    idMClient,
    employee.id_m_employee,
    TARGET_FULLNAME,
    TARGET_EMAIL,
    TARGET_PASSWORD,
  ]);

  console.log("Account berhasil dibuat:", inserted.rows[0]?.id_m_user || "(id tidak tersedia)");
}

(async () => {
  try {
    await upsertZoraAccount();
    process.exit(0);
  } catch (error) {
    console.error("Gagal create account zora:", error.message);
    process.exit(1);
  }
})();
