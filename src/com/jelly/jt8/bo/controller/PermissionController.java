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
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(method = RequestMethod.GET)
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

    @RequestMapping(method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> addPermission(@RequestBody Permission permission){
        System.out.println("permission post");

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

    @RequestMapping(value = "{id}",method = RequestMethod.PUT)
    public @ResponseBody ResponseEntity<String> updatePermission(@PathVariable("id") int id, @RequestBody Permission permission){

        String payload = "";
        try {
            permissionService.updatePermission(permission.getPermission_id(),permission);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<String>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Gson gson = new Gson();
        payload = gson.toJson(permission);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}",method = RequestMethod.DELETE)
    public @ResponseBody ResponseEntity<String> removePermission(@PathVariable("id") int id, @RequestBody Permission permission){
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

    @RequestMapping(value = "move",method = RequestMethod.POST)
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
