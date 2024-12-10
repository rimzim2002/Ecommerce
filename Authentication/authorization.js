const authorization = async(req,res, next)=>{
    try{
      const userRole = req.user.role;
      if(userRole == 1){
        return next();
      };
      return res.status(200).json({status: 400, message: "You have no rights to use the routes"})
    }catch(err){
        return res.status(500).json({status: 500, message: err.message})
    }
}
export default authorization; 