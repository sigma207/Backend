package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.ErrorJson;
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
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
@Controller
@RequestMapping("/role")
public class RoleController extends BaseController {
    @Autowired
    @Qualifier("roleService")
    private RoleService roleService;

    @RequestMapping( method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getRoleList() {
        System.out.println("selectRole");
        Gson gson = new Gson();
        List<Role> list = null;
        String payload = "";
        try {
            list = roleService.selectRole();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping( method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> addRole(@RequestBody Role role) {
        System.out.println("addRole");
        Gson gson = new Gson();
        String payload = "";
        try {
            roleService.addRole(role);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public
    @ResponseBody
    ResponseEntity<String> updateRole(@PathVariable("id") String id, @RequestBody Role role) {
        System.out.println("updateRole");
        Gson gson = new Gson();
        String payload = "";
        try {
            roleService.updateRole(role);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public
    @ResponseBody
    ResponseEntity<String> deleteRole(@PathVariable("id") String id, @RequestBody Role role) {
        Gson gson = new Gson();
        String payload = "";
        try {
            roleService.deleteRole(role);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}/permission", method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getRolePermissionList(@PathVariable("id") int id ) {
        System.out.println("selectRolePermission");
        Gson gson = new Gson();
        List<RolePermission> list = null;
        String payload = "";

        try {
            list = roleService.selectRolePermission(id);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}/permission", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> allocatePermission(@RequestBody Role role) {
        System.out.println("allocatePermission");
        Gson gson = new Gson();
        String payload = "";
        try {
            roleService.allocatePermission(role);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(role);
        return getResponseEntity(payload);
    }
}
