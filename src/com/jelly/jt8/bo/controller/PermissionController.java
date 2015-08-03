package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.model.PermissionMoveSetting;
import com.jelly.jt8.bo.service.PermissionService;
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
import java.sql.SQLException;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
@Controller
@RequestMapping("/permission")
public class PermissionController extends BaseController{
    @Autowired
    @Qualifier("permissionService")
    private PermissionService permissionService;

    @RequestMapping(value="/query/list",method = RequestMethod.GET)
    public @ResponseBody ResponseEntity<String> getPermissionList(){
        System.out.println("getPermissionList");

        List<Permission> list = null;
        String payload = "";
        try {
            list = permissionService.getPermissionList();
            if(list.size()==0){
                JsonObject myObj = new JsonObject();
                myObj.addProperty("result","noData");
                payload = myObj.toString();
                return getResponseEntity(payload);
            }
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/add",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> addPermission(@RequestBody Permission permission){
        System.out.println("addPermission");

        String payload = "";
        try {
            permissionService.addPermission(permission);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(permission);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/delete",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> removePermission(@RequestBody Permission permission){
        System.out.println("removePermission");

        String payload = "";
        try {
            permissionService.deletePermission(permission);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(permission);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/update",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> updatePermission(@RequestBody Permission permission){
        System.out.println("updatePermission");

        String payload = "";
        try {
            permissionService.updatePermission(permission);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(permission);
        return getResponseEntity(payload);
    }

    @RequestMapping(value="/move",method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> movePermission(@RequestBody PermissionMoveSetting permissionMoveSetting){
        System.out.println("movePermission");

        String payload = "";
        try {
            permissionService.movePermission(permissionMoveSetting);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(permissionMoveSetting.getMoveNodes());
        return getResponseEntity(payload);
    }

}
