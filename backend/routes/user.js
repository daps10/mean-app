const express = require("express");

const UserController = require("../controllers/user");
const router = express.Router()

router.post("/signup", UserController.createUser)
router.post("/login", UserController.userLogin)


router.post("/autocomplete", (req, res) => {
    user.aggregate([
        {
            $search: {
                "autocomplete": {
                    "path": "name",
                    "query": req.body.name,
                    "tokenOrder": "any",
                    "fuzzy": {
                        "maxEdits": 1,
                        "prefixLength": 1,
                        "maxExpansions": 256
                    }
                }
            }
        },
        {
            $limit: 10
        }
    ])
    .then(user => {
        res.status(200).json({
            data:user
        })
    }).catch(err => {
        return res.status(401).json({
            message: "Not Found!"
        });
    });
})

module.exports = router;