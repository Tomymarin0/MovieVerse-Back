// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var List = require("../models/List.model")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query)
        var Users = await User.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Users');
    }
}



exports.createUser = async function (user) {
    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(user.password, 8);

        // Create a new user object
        const newUser = new User({
            name: user.name,
            email: user.email,
            date: new Date(),
            password: hashedPassword
        });

        // Create user lists
        const newUserLists = new List({
            email: user.email,
            favoritas: [], 
            porVer: [], 
            vistas: [] 
        });

        // Save the user and the lists
        const savedUser = await newUser.save();
        await newUserLists.save();

        // Generate token
        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, { expiresIn: 86400 }); // expires in 24 hours
        
        return token;
    } catch (error) {
        console.log(error);
        throw new Error("Error al crear usuario: " + error.message);
    }
}

exports.addFavoritas = async function (user) {
    const { email, id, media_type } = user;

    try {
        // Buscar el usuario por su correo electrónico
        const oldUser = await List.findOne({ email });

        if (!oldUser) {
            throw new Error("User not found");
        }

        // Verificar si el idPeliSerie ya existe en la lista de favoritas
        const existsInFavoritas = oldUser.favoritas.some(fav => fav.id === id && fav.media_type === media_type);

        if (existsInFavoritas) {
            throw new Error("The movie/series already exists in the favorites list");
        }

        // Agregar idPeliSerie a la lista de favoritas del usuario
        oldUser.favoritas.push({ id, media_type });

        // Guardar y retornar el usuario actualizado
        const savedUser = await oldUser.save();
        return savedUser;
    } catch (error) {
        throw new Error("Error adding to favorites: " + error.message);
    }
};

exports.addPorVer = async function (user) {
    const { email, id, media_type } = user;

    try {
        // Buscar el usuario por su correo electrónico
        const oldUser = await List.findOne({ email });

        if (!oldUser) {
            throw new Error("User not found");
        }

        // Verificar si el idPeliSerie ya existe en la lista de favoritas
        const existsInFavoritas = oldUser.porVer.some(por => por.id === id && por.media_type === media_type);

        if (existsInFavoritas) {
            throw new Error("The movie/series already exists in the favorites list");
        }

        // Agregar idPeliSerie a la lista de favoritas del usuario
        oldUser.porVer.push({ id, media_type });

        // Guardar y retornar el usuario actualizado
        const savedUser = await oldUser.save();
        return savedUser;
    } catch (error) {
        throw new Error("Error adding to favorites: " + error.message);
    }
};

exports.addVistas = async function (user) {
    const { email, id, media_type } = user;

    try {
        // Buscar el usuario por su correo electrónico
        const oldUser = await List.findOne({ email });

        if (!oldUser) {
            throw new Error("User not found");
        }

        // Verificar si el idPeliSerie ya existe en la lista de favoritas
        const existsInFavoritas = oldUser.vistas.some(vis => vis.id === id && vis.media_type === media_type);

        if (existsInFavoritas) {
            throw new Error("The movie/series already exists in the favorites list");
        }

        // Agregar idPeliSerie a la lista de favoritas del usuario
        oldUser.vistas.push({ id, media_type });

        // Guardar y retornar el usuario actualizado
        const savedUser = await oldUser.save();
        return savedUser;
    } catch (error) {
        throw new Error("Error adding to favorites: " + error.message);
    }
};

exports.removeFavoritas = async function (req, res, next) {
    const { user, list } = req;

    try {
        const { id, media_type } = req.body;
        // Filtrar la lista de favoritas para eliminar el elemento coincidente
        const updatedFavoritas = list.favoritas.filter(item => item.id !== Number(id) || item.media_type !== media_type);

        // Actualizar la lista de favoritas del usuario
        list.favoritas = updatedFavoritas;

        const savedList = await list.save();

        return res.status(200).json({ message: 'Successfully removed from favoritas list', list: savedList });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Cannot remove from favoritas list' });
    }
};



exports.removeFromPorVer = async function (req, res, next) {
    const { user, list } = req;

    try {
        const { id, media_type } = req.body;
        // Filtrar la lista de favoritas para eliminar el elemento coincidente
        const updatedFavoritas = list.porVer.filter(item => item.id !== Number(id) || item.media_type !== media_type);

        // Actualizar la lista de favoritas del usuario
        list.porVer = updatedFavoritas;

        const savedList = await list.save();

        return res.status(200).json({ message: 'Successfully removed from favoritas list', list: savedList });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Cannot remove from favoritas list' });
    }
};


exports.removeFromVistas = async function (req, res, next) {
    const { user, list } = req;

    try {
        const { id, media_type } = req.body;
        // Filtrar la lista de favoritas para eliminar el elemento coincidente
        const updatedFavoritas = list.vistas.filter(item => item.id !== Number(id) || item.media_type !== media_type);

        // Actualizar la lista de favoritas del usuario
        list.vistas = updatedFavoritas;

        const savedList = await list.save();

        return res.status(200).json({ message: 'Successfully removed from favoritas list', list: savedList });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Cannot remove from favoritas list' });
    }
};


exports.getFavoritas = async function (user) {
    const { email } = user;
    
    try {
        // Buscar el objeto List por el email del usuario
        const foundUser = await List.findOne({ email });

        if (!foundUser || !Array.isArray(foundUser.favoritas)) {
            throw new Error("User has no favoritas list or it is not an array");
        }

        // Devolver el array de favoritas
        return foundUser.favoritas;
    } catch (e) {
        throw new Error("Error occurred while finding or accessing favoritas list: " + e.message);
    }
};

exports.getPorVer = async function (user) {
    const { email } = user;
    
    try {
        // Buscar el objeto List por el email del usuario
        const foundUser = await List.findOne({ email });

        if (!foundUser || !Array.isArray(foundUser.porVer)) {
            throw new Error("User has no favoritas list or it is not an array");
        }

        // Devolver el array de favoritas
        return foundUser.porVer;
    } catch (e) {
        throw new Error("Error occurred while finding or accessing favoritas list: " + e.message);
    }
};

exports.getVistas = async function (user) {
    const { email } = user;
    
    try {
        // Buscar el objeto List por el email del usuario
        const foundUser = await List.findOne({ email });

        if (!foundUser || !Array.isArray(foundUser.vistas)) {
            throw new Error("User has no favoritas list or it is not an array");
        }

        // Devolver el array de favoritas
        return foundUser.vistas;
    } catch (e) {
        throw new Error("Error occurred while finding or accessing favoritas list: " + e.message);
    }
};



exports.updateUser = async function (user) {
    var id = { email: user.email };

    try {
        var oldUser = await User.findOne(id);
    } catch (e) {
        throw Error("Error occurred while finding the user");
    }

    if (!oldUser) {
        throw Error("User not found");
    }

    var hashedPassword = bcrypt.hashSync(user.password, 8);
    oldUser.password = hashedPassword;

    try {
        var savedUser = await oldUser.save();
        return savedUser;
    } catch (e) {
        throw Error("Error occurred while updating the user");
    }
}

exports.deleteUser = async function (id) {
    console.log(id)
    // Delete the User
    try {
        var deleted = await User.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}


exports.loginUser = async function ({ email, password, user }) {
    try {
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return 0;

        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return { token, user };
    } catch (e) {
        throw Error("Error while logging in user");
    }
}