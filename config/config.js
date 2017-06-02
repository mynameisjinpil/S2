/**
 * Created by user on 2017-05-25.
 */


module.exports = {
    server_port: 3000,
    db_url: 'mongodb://customer:yu8950@ds161121.mlab.com:61121/heroku_43cwnr1k',
    db_schemas: [
        {file: './user_schema', collection: 'customer', schemaName: 'UserSchema', modelName: 'UserModel'}
    ],
    route_info: [

    ]
}