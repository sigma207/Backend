package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.Organization;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.service.OrganizationService;
import com.jelly.jt8.bo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by user on 2015/8/22.
 */
@Controller
@RequestMapping("/organization")
public class OrganizationController extends BaseController{
    @Autowired
    @Qualifier("organizationService")
    private OrganizationService service;

    @RequestMapping( method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getList() {
        Gson gson = new Gson();
        List<Organization> list = null;
        String payload = "";
        try {
            list = service.select();
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
    ResponseEntity<String> addRole(@RequestBody Organization organization) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.insert(organization);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public
    @ResponseBody
    ResponseEntity<String> updateRole(@PathVariable("id") String id, @RequestBody Organization organization) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.update(organization.getOrg_id(), organization);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public
    @ResponseBody
    ResponseEntity<String> deleteRole(@PathVariable("id") String id, @RequestBody Organization organization) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.delete(organization.getOrg_id(),organization);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }
}
