import { getConnection } from "./../database/database.js";

// const getMusica = (req,res) => {
//     res.json("Api Musical v1 - 27-02-2025")
// }

const getArtistas = async (req, res) =>{
    try{
        const connection = await getConnection();
        const result = await connection.query("SELECT idartista, nombreArtistico from artista");
        res.json(result);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const addArtistas = async (req, res) =>{
    try{
        const {idartista,nombreArtistico} = req.body;

        if(idartista == undefined || nombreArtistico == undefined){
            res.status(400).json({message:"Bad Request. Please fill all field"});
        }

        const artista = {idartista,nombreArtistico};
        const connection = await getConnection();
        const result=await connection.query("INSERT INTO artista set ?",artista)
        res.json("Artista Añadido");
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getArtistas,
    addArtistas
};