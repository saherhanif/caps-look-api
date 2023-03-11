const db = require('../connection')

const getPisProject = async (project_id) => {
  const PisProjectTable = await db.query(
    `SELECT * FROM pi WHERE project_id=($1) AND isarchived=false`,
    [project_id]
  )
  return PisProjectTable.rows
}
const getIterationspi = async (pi_id, project_id) => {
  const iterationPiTable = await db.query(
    `SELECT * FROM iteration WHERE project_id=($1) AND pi_id=($2) AND isarchived=false`,
    [pi_id, project_id]
  )
  return iterationPiTable.rows
}
const createPi = async (project_id, pi_name) => {
  const pis = parseInt(pi_name)
  for (let i = 1; i <= pis; i++) {
    await db.query(
      `INSERT INTO pi (pi_name,project_id) VALUES ($1,$2) RETURNING *`,
      [`PI-${i}`, project_id]
    )
  }
}
const addPi = async (project_id, pis_input, pis) => {
  const pi = pis[pis.length - 1]
  const sliced = pi.pi_name.slice(3, 7)
  let index = parseInt(sliced) + 1
  console.log('index', index)
  let maxValue = index + parseInt(pis_input)
  for (let i = index; i < maxValue; i++) {
    await db.query(
      `INSERT INTO pi (pi_name,project_id) VALUES ($1,$2) RETURNING *`,
      [`PI-${i}`, project_id]
    )
  }
}
const deletePi = async (pis_input, pis, project_id) => {
  let value = pis.length - parseInt(pis_input)

  for (let i = pis.length - 1; i >= value; i--) {
    await db.query(
      `DELETE from iteration where pi_id=($1) and project_id=($2)`,
      [pis[i].id, project_id]
    )
    await db.query(`Delete from  pi where id= ($1) and project_id=($2)`, [
      pis[i].id,
      project_id
    ])
  }
}
const createIteration = async (
  pi_id,
  project_id,
  iteration_number,
  startDate,
  endDate
) => {
  return await db.query(
    `INSERT INTO iteration (project_id,pi_id, iteration_number,
      iteration_start_date,
      iteration_end_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,

    [pi_id, project_id, iteration_number, startDate, endDate]
  )
}
module.exports = {
  getPisProject,
  getIterationspi,
  createPi,
  addPi,
  deletePi,
  createIteration
}
