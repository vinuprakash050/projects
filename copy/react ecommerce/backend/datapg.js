const{Client}=require('pg')

const con = new Client({
    host:"localhost",
    user:"postgres",
    port:"5432",
    password:"1dragvin",
    database:"project"

})

con.connect().then(()=>console.log("connected"))
con.query("SELECT * FROM public.products ORDER BY id ASC ",(err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log(res.rows);
    }
    con.end();
});