
const fs = require("fs")
const data = require("../data.json")
const { age, date } = require("../utils")

//show
exports.show = function (req, res) {

    const { id } = req.params

    const foundTeacher = data.teachers.find(function (teacher) {

        return id == teacher.id
    })

    if (!foundTeacher) {
        return res.send("Professor não encontrado!")
    }

    const keys = Object.keys(req.body)

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        materias: foundTeacher.materias.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
    }

    return res.render("./teachers/show", { teacher })

}
//create
exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send(`Por favor preencha o campo: ${key}`)
        }
    }

    let { avatar_url, name, birth, grau, aula_type, materias } = req.body



    birth = Date.parse(birth)
    const created_at = Date.now()
    let id = 1
    const lastTeacher = data.teachers[data.teachers.length - 1].id

    if (lastTeacher) {
        id = lastTeacher + 1
    }

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        grau,
        aula_type,
        materias,
        created_at
    })


    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("write file error!")

        return res.redirect("teachers")
    })
}

//edit
exports.edit = function (req, res) {

    const { id } = req.params

    const foundTeacher = data.teachers.find(function (teacher) {

        return id == teacher.id
    })

    if (!foundTeacher) {
        return res.send("Professor não encontrado!!")
    }

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso,
    }


    return res.render("./teachers/edit", { teacher })
}

exports.put = function (req, res) {

    const { id } = req.body

    let index = 0

    const foundTeacher = data.teachers.find(function (teacher, foundIndex) {

        if (id == teacher.id) {

            index = foundIndex
            return true
        }
    })

    if (!foundTeacher) {
        return res.send("Professor não encontrado!!")
    }


    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)

    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("write file error!")

        return res.redirect(`/teachers/${id}`)
    })
}

//delete
exports.delete = function (req, res) {
    const { id } = req.body

    const filteredTeachers = data.teachers.filter(function (teacher) {
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

        if (err) return res.send("Write file Error!")

        return res.redirect("/teachers")
    })
}

