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

    @RequestMapping(value = "{id}",  method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> get(@PathVariable("id") int id) {
        Gson gson = new Gson();
        Organization organization = null;
        String payload = "";
        try {
            organization = service.select(id);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}/with_children",  method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getList(@PathVariable("id") int id) {
        Gson gson = new Gson();
        List<Organization> list = null;
        String payload = "";
        try {
            list = service.selectWithChildren(id);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> add(@RequestBody Organization organization) {
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
    ResponseEntity<String> update(@PathVariable("id") int id, @RequestBody Organization organization) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.update(id, organization);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public
    @ResponseBody
    ResponseEntity<String> delete(@PathVariable("id") int id, @RequestBody Organization organization) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.delete(id,organization);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(organization);
        return getResponseEntity(payload);
    }
}
