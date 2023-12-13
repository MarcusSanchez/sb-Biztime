import express from "express";
import slugify from "slugify";
import ExpressError from "../expressError";
import db from "../db.js";

const Companies = express.Router();

Companies.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT code, name FROM companies ORDER BY name`);
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

Companies.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const companyResult = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
    const invoicesResult = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [code]);

    if (companyResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    const company = companyResult.rows[0];
    const invoices = invoicesResult.rows;

    company.invoices = invoices.map(inv => inv.id);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

Companies.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, { lower: true });

    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);

    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

Companies.put("/:code", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { code } = req.params;

    const companyResult = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);

    if (companyResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    return res.json({ company: companyResult.rows[0] });
  } catch (err) {
    return next(err);
  }
});

Companies.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code]);

    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

export default Companies;