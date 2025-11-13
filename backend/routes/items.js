const {getItems, getItem} = require('../controllers/items')
//item schema 

const Item = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        name: {type: 'string'}
    }
}
//options for get all items
const getItemsOps = {
    schema: {
        response:{
            200: {
                type: 'array',
                items: Item 
            }
        }
    },
    handler: getItems,
}

const getItemOps = {
    schema: {
        response:{
            200: Item
        }
    },
    handler: getItem,
}

function itemRoutes (fastify, options, done)
{
    // get all items
    fastify.get('/items', getItemsOps)

    // get single items
    fastify.get('/items/:id', getItemOps)

    done()
}

module.exports = itemRoutes