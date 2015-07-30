package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.charset.Charset;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
@Controller
@RequestMapping("/role")
public class RoleController {
    @Autowired
    @Qualifier("roleService")
    private RoleService roleService;

    @RequestMapping(value = "/query/list", method = RequestMethod.GET)
    public @ResponseBody ResponseEntity<String> getRoleList() {
        System.out.println("getRoleList");

        List<Role> list = null;
        String payload = "";
        try {
            list = roleService.getRoleList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "/query/rolePermissionList", method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> getRolePermissionList(@RequestBody Role role) {
        System.out.println("getRolePermissionList");

        List<RolePermission> list = null;
        String payload = "";
        try {
            roleService.getRolePermissionList(role);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/addRole",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> addRole(@RequestBody Role role){
        System.out.println("addRole");

        String payload = "";
        try {
            roleService.addRole(role);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/updateRole",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> updateRole(@RequestBody Role role){

        String payload = "";
        try {
            roleService.updateRole(role);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/deleteRole",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> deleteRole(@RequestBody Role role){

        String payload = "";
        try {
            roleService.deleteRole(role);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/allocatePermission",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> allocatePermission(@RequestBody Role role){
        System.out.println("allocatePermission");

        String payload = "";
        try {
            roleService.allocatePermission(role);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    private ResponseEntity<String> getResponseEntity(String payload) {
        MediaType mediaType=new MediaType("text","html", Charset.forName("UTF-8"));
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);
        responseHeaders.setContentType(mediaType);
        return new ResponseEntity<String>(payload, responseHeaders, HttpStatus.OK);
    }
}
