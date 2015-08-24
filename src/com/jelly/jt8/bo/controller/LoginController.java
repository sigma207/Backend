package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by user on 2015/8/24.
 */
@Controller
@RequestMapping("/login")
public class LoginController extends BaseController{
    @Autowired
    @Qualifier("userService")
    private UserService userService;

    @RequestMapping(method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> login( @RequestBody User user,HttpServletRequest request){
        String payload = "";
        User loginUser = null;
        System.out.println(request.getSession().getId());
        Gson gson = new Gson();
        try {
            loginUser = userService.login(user.getLogin_id(),user.getPassword());
        } catch (Exception e){
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(loginUser);
        return getResponseEntity(payload);
    }
}
