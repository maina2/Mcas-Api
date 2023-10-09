import { signup } from "../controllers/Authentication.js";

const routes= (app) =>{

    // app.route('/auth/login')
    //     .post(login);

      app.route('/auth/signup')
        .post(signup);

}

export default routes;