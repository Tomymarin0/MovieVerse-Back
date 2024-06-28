
const { body, validationResult } = require('express-validator');
const User = require('../models/User.model'); 
const List = require('../models/List.model'); 

// Validation middleware for user creation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


const validateCreateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email } = req.body;
        try {

            const existingUser = await User.findOne({ $or: [{ name: name }, { email: email }] });
            if (existingUser) {
                if (existingUser.email === email) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                if (existingUser.name === name) {
                    return res.status(400).json({ message: 'Name already in use' });
                }
            }
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];


const validateAddFavoritas = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('id').notEmpty().withMessage('id is required'),
    body('media_type').notEmpty().withMessage('media_type is required'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, id, media_type } = req.body;

        try {
            // Verificar si el usuario existe en la lista
            const user = await List.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verificar si el idPeliSerie ya existe en la lista de favoritas
            const existsInFavoritas = user.favoritas.some(fav => fav.id === Number(id) && fav.media_type === media_type);

            if (existsInFavoritas) {
                return res.status(400).json({ message: 'La Pelicuala o Serie ya existe en la lista "Favoritas"' });
            }

            req.user = user; // Pasar el usuario encontrado al objeto de solicitud para que el controlador lo pueda utilizar
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];


const validateAddToPorVer = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('id').notEmpty().withMessage('id is required'),
    body('media_type').notEmpty().withMessage('media_type is required'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, id, media_type } = req.body;

        try {
            // Verificar si el usuario existe en la lista
            const user = await List.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verificar si el idPeliSerie ya existe en la lista de favoritas
            const existsInFavoritas = user.porVer.some(fav => fav.id === Number(id) && fav.media_type === media_type);
            
            if (existsInFavoritas) {
                return res.status(400).json({ message: 'La Pelicuala o Serie ya existe en la lista "Por Ver"' });
            }

            req.user = user; // Pasar el usuario encontrado al objeto de solicitud para que el controlador lo pueda utilizar
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];


const validateAddToVistas = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('id').notEmpty().withMessage('id is required'),
    body('media_type').notEmpty().withMessage('media_type is required'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, id, media_type } = req.body;

        try {
            // Verificar si el usuario existe en la lista
            const user = await List.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar si el idPeliSerie ya existe en la lista de favoritas
            const existsInFavoritas = user.vistas.some(fav => fav.id === Number(id) && fav.media_type === media_type);
            
            if (existsInFavoritas) {
                return res.status(400).json({ message: 'La Pelicuala o Serie ya existe en la lista "Vistas"' });
            }

            req.user = user; // Pasar el usuario encontrado al objeto de solicitud para que el controlador lo pueda utilizar
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

const validateRemoveFromFavoritas = async (req, res, next) => {
    const { email, id, media_type } = req.body;

    try {
        // Verifica si existe el usuario
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si existe la lista de favoritas y es un array
        const list = await List.findOne({ email });

        if (!list || !Array.isArray(list.favoritas)) {
            return res.status(400).json({ message: 'User has no favoritas list or it is not an array' });
        }

        // Verifica si el id y media_type existen en la lista favoritas del usuario
        const existsInFavoritas = list.favoritas.some(item => item.id === Number(id) && item.media_type === media_type);

        if (!existsInFavoritas) {
            return res.status(400).json({ message: 'Movie/series does not exist in the favoritas list' });
        }

        req.user = user;
        req.list = list; // Pasamos la lista al request para usarla en el controlador
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




const validateRemoveFromPorVer = async (req, res, next) => {
    const { email, id, media_type } = req.body;

    try {
        // Verifica si existe el usuario
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si existe la lista de favoritas y es un array
        const list = await List.findOne({ email });

        if (!list || !Array.isArray(list.porVer)) {
            return res.status(400).json({ message: 'User has no favoritas list or it is not an array' });
        }

        // Verifica si el id y media_type existen en la lista favoritas del usuario
        const existsInFavoritas = list.porVer.some(item => item.id === Number(id) && item.media_type === media_type);

        if (!existsInFavoritas) {
            return res.status(400).json({ message: 'Movie/series does not exist in the favoritas list' });
        }

        req.user = user;
        req.list = list; // Pasamos la lista al request para usarla en el controlador
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const validateRemoveFromVistas = async (req, res, next) => {
    const { email, id, media_type } = req.body;

    try {
        // Verifica si existe el usuario
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si existe la lista de favoritas y es un array
        const list = await List.findOne({ email });

        if (!list || !Array.isArray(list.vistas)) {
            return res.status(400).json({ message: 'User has no favoritas list or it is not an array' });
        }

        // Verifica si el id y media_type existen en la lista favoritas del usuario
        const existsInFavoritas = list.vistas.some(item => item.id === Number(id) && item.media_type === media_type);

        if (!existsInFavoritas) {
            return res.status(400).json({ message: 'Movie/series does not exist in the favoritas list' });
        }

        req.user = user;
        req.list = list; 
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const validateGetFavoritas = [
    body('email').isEmail().withMessage('Invalid email format'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; 
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

const validateGetPorVer = [
    body('email').isEmail().withMessage('Invalid email format'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; 
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

const validateGetVistas = [
    body('email').isEmail().withMessage('Invalid email format'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; 
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').not().isEmpty().withMessage('Password cannot be empty'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'User does not exist' });
        }
        
        req.user = user; 
        next();
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
  ];

const validateUpdateUser = [
    body('email').notEmpty().withMessage('email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors,
    async (req, res, next) => {
        const { email } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = existingUser; // Pasar el usuario encontrado al objeto de solicitud
            next();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];



module.exports = {
    validateCreateUser, validateAddFavoritas, validateAddToPorVer, validateAddToVistas, validateRemoveFromFavoritas, validateRemoveFromPorVer, validateRemoveFromVistas, validateGetFavoritas, validateGetVistas, validateGetPorVer,
    validateLogin, validateUpdateUser
};
