const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//establecemos los parámetros de conexión
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'elecciones-dbuser',
    password: '!elecciones2021',
    database: 'elecciones'
});
//------------------------------------------
//------------------------------------------

//establecemos la conexión
conexion.connect((err) => {
    if(err){
        throw err;
    }else{
        console.log("Conexión exitosa a la DB.")
    }
});
//------------------------------------------------
//------------------------------------------------

//render de la página
app.get('/', (req, res) => {
    res.send('');
});
//-----------------------------
//-----------------------------

//leemos los registros de la tabla
app.get('/api/:mesa', (req, res) => {
    let mesaGet = req.params.mesa
    conexion.query(`SELECT * from ${mesaGet}`, (err, rows) => {
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    });
});
//----------------------------------------------------------
//----------------------------------------------------------


//leemos un solo registro
app.get('/api/:mesa/:id', (req, res) => {
    let mesaGet = req.params.mesa
    conexion.query(`SELECT * from ${mesaGet} where id = ?`, [req.params.id], (err, row) => {
        if(err){
            throw err;
        }else{
            res.send(row);
        }
    });
});
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------

//ingresar un nuevo registro en tabla mesa1
app.post("/api/:mesa", (req, res) => {
    let mesaPost = req.params.mesa
    let data = {nombre:req.body.nombre, apellido:req.body.apellido, dni:req.body.dni, mesa:req.body.mesa, votacion:req.body.votacion};
    let sql = `INSERT INTO ${mesaPost} SET ?`;
    conexion.query(sql, data, (err, results) => {
        if(err){
            throw err;
        }else{
            Object.assign(data, {id: results.insertId})
            res.send(data)
        }
    });
});
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//editar un registro en tabla mesa1
app.put("/api/:mesa/:id", (req, res) => {
    let mesaPut = req.params.mesa
    let id = req.params.id;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let dni = req.body.dni;
    let mesa = req.body.mesa;
    let votacion = req.body.votacion;
    let sql = `UPDATE ${mesaPut} SET nombre = ?, apellido = ?, dni = ?, mesa = ?, votacion = ? WHERE id = ?`;
    conexion.query(sql, [nombre, apellido, dni, mesa, votacion, id], (err, results) => {
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------


//eliminar un registro en la tabla mesa1
app.delete("/api/:mesa/:id", (req, res) => {
    let mesaDelete = req.params.mesa
    conexion.query(`DELETE FROM ${mesaDelete} WHERE id = ?`, [req.params.id], (err, rows) => {
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    });
});
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//qué puerto debe utilizar
const puerto = process.env.PUERTO || 1337;
//-------------------------------------------
//-------------------------------------------

//qué puerto escuchar para ser llamada
app.listen(puerto, () => {
    console.log("Servidor Ok en puerto "+puerto);
});
//-------------------------------------------------
//-------------------------------------------------