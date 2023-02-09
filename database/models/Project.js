const db = require('../connection')

const createProject = async (
  project_name,
  start_date,
  project_iterations_count
) => {
  return await db.query(
    `INSERT INTO project (project_name,start_date,project_iterations_count) VALUES ($1,$2,$3) RETURNING *`,
    [project_name, start_date, project_iterations_count]
  )
}
const editProject = async (
  project_name,
  project_iterations_count,
  start_date,
  
  id
) => {
  return await db.query(
    `UPDATE project SET project_name= $1,project_iterations_count=$2 ,start_date=$3  where id=$4`,
    [project_name,project_iterations_count, start_date ,id]
  )
}

const getProjects = async () => {
  const projectTable = await db.query(`SELECT * FROM project`)

  return Promise.resolve(projectTable.rows)
}

const getProjectsDetails = async () => {
  const data = await db.query(
    'SELECT project.project_name,project.id,project.start_date,(SELECT COUNT(*) FROM iteration where project_id=project.id) as iteration_number, (SELECT COUNT(*) FROM scrum where project_id=project.id) as scrum_number,(SELECT COUNT(*) FROM employee WHERE employee.project_id = project.id) as employee_number FROM project'
  )
  return data.rows
}
module.exports = { createProject, editProject, getProjects, getProjectsDetails }
