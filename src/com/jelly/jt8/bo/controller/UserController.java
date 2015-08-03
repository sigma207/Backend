package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;
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

import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
@Controller
@RequestMapping("/user")
public class UserController extends BaseController{
    @Autowired
    @Qualifier("userService")
    private UserService userService;

    @RequestMapping(value = "/selectUser", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<String> selectUser() {
        System.out.println("selectUser");

        List<User> list = null;
        String payload = "";
        try {
            list = userService.selectUser();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "/selectUserRole", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> selectUserRole(@RequestBody User user) {
        System.out.println("selectUserRole");

        List<UserRole> list = null;
        String payload = "";
        try {
            list = userService.selectUserRole(user);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/insertUser",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> addRole(@RequestBody User user){
        System.out.println("insertUser");

        String payload = "";
        try {
            userService.insertUser(user);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(user);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/deleteUser",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> deleteRole(@RequestBody User user){

        String payload = "";
        try {
            userService.deleteUser(user);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(user);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/allocateUserRole",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> allocateUserRole(@RequestBody User user){
        System.out.println("allocateUserRole");

        String payload = "";
        try {
            userService.allocateUserRole(user);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(user);
        return getResponseEntity(payload);
    }
}
