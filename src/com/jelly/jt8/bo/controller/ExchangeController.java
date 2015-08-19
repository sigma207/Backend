package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.Exchange;
import com.jelly.jt8.bo.service.MainSymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by user on 2015/8/19.
 */
@Controller
@RequestMapping("/exchange")
public class ExchangeController extends BaseController {
    @Autowired
    @Qualifier("mainSymbolService")
    private MainSymbolService service;

    @RequestMapping(method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getExchangeList() {
        System.out.println("getExchangeList");
        Gson gson = new Gson();
        List<Exchange> list = null;
        String payload = "";
        try {
            list = service.selectExchange();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }
}
