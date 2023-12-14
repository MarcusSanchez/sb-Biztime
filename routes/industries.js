import express from "express";
import ExpressError from "../expressError";
import db from "../db";

let Industries = express.Router();

Industries.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT code, industry FROM industries ORDER BY code`);
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

Industries.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.query(`
      SELECT i.code, i.industry, c.code AS comp_code, c.name, c.description
      FROM industries AS i
      INNER JOIN companies_industries AS ci ON (i.code = ci.industry_code)
      INNER JOIN companies AS c ON (ci.comp_code = c.code)
      WHERE i.code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`No such industry: ${code}`, 404);
    }

    const data = result.rows[0];
    const industry = {
      code: data.code,
      industry: data.industry,
      companies: [{
        code: data.comp_code,
        name: data.name,
        description: data.description,
      }],
    };

    return res.json({ industry });
  } catch (err) {
    return next(err);
  }
});

Industries.post("/", async (req, res, next) => {
  try {
    const { code, industry } = req.body;

    const result = await db.query(`
      INSERT INTO industries (code, industry)
      VALUES ($1, $2)
      RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

Industries.post("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { comp_code } = req.body;

    const result = await db.query(`
      INSERT INTO companies_industries (comp_code, industry_code)
      VALUES ($1, $2)
      RETURNING comp_code, industry_code`,
      [comp_code, code]
    );

    return res.status(201).json({ company_industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

Industries.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.query(`
      DELETE FROM industries
      WHERE code = $1
      RETURNING code`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`No such industry: ${code}`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

export default Industries;
