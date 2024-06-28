var UserService = require('../services/user.service');


// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}
exports.getUsersByMail = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro= {email: req.body.email}
    console.log(filtro)
    try {
        var Users = await UserService.getUsers(filtro, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}



exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var User = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({createdUser, message: "Succesfully Created User"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}

exports.addFavoritas = async function (req, res, next) {
    const { id, media_type } = req.body;
    const user = req.user; 

    user.favoritas.push({ id, media_type });

    try {
        const savedUser = await user.save();
        return res.status(201).json({ user: savedUser, message: "Successfully added to favorites" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.addPorVer = async function (req, res, next) {
    const { id, media_type } = req.body;
    const user = req.user; 


    user.porVer.push({ id, media_type });

    try {
        const savedUser = await user.save();
        return res.status(201).json({ user: savedUser, message: "Successfully added to favorites" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.addVistas = async function (req, res, next) {
    const { id, media_type } = req.body;
    const user = req.user; 

 
    user.vistas.push({ id, media_type });

    try {
        const savedUser = await user.save();
        return res.status(201).json({ user: savedUser, message: "Successfully added to favorites" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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


exports.removePorVer = async function (req, res, next) {
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

exports.removeVistas = async function (req, res, next) {
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

exports.getFavoritas = async function (req, res, next) {
    try {
        const { email } = req.user; 
        const favoritas = await UserService.getFavoritas({ email });
        return res.status(200).json({ favoritas });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Error retrieving favoritas" });
    }
};

exports.getPorVer = async function (req, res, next) {
    try {
        const { email } = req.user; 
        const favoritas = await UserService.getPorVer({ email });
        return res.status(200).json({ favoritas });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Error retrieving favoritas" });
    }
};

exports.getVistas = async function (req, res, next) {
    try {
        const { email } = req.user; 
        const favoritas = await UserService.getVistas({ email });
        return res.status(200).json({ favoritas });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Error retrieving favoritas" });
    }
};

exports.updateUser = async function (req, res, next) {


    if (!req.body.email) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    
    var User = {
       
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null
    }

    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json("Contraseña cambiada correctamente")
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeUser = async function (req, res, next) {

    var id = req.body.id;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}


exports.loginUser = async function (req, res, next) {
    const { email, password } = req.body;
    const user = req.user; 

    try {
        const loginUser = await UserService.loginUser({ email, password, user });
        if (loginUser === 0) {
            return res.status(400).json({ message: "Incorrect password" });
        } else {
            return res.status(201).json({ loginUser, message: "Successfully logged in" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Invalid username or password" });
    }
}


    
    
