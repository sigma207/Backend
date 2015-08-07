package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.ErrorJson;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.charset.Charset;

/**
 * Created by user on 2015/7/30.
 */
public class BaseController {
    protected ResponseEntity<String> getResponseEntity(String payload) {
        MediaType mediaType=new MediaType("text","html", Charset.forName("UTF-8"));
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);
        responseHeaders.setContentType(mediaType);
        return new ResponseEntity<String>(payload, responseHeaders, HttpStatus.OK);
    }

    protected ErrorJson exceptionToJson(Exception e) {
        e.printStackTrace();
        ErrorJson errorJson = new ErrorJson();
        errorJson.setMessage(e.getMessage());
        return errorJson;
    }
}
