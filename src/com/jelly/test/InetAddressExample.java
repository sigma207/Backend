package com.jelly.test;

import java.net.*;
import java.util.Enumeration;

/**
 * Created by user on 2015/7/2.
 */
public class InetAddressExample {
    public static void main(String[] args){
        try {
            Enumeration<NetworkInterface> interfaceList = NetworkInterface.getNetworkInterfaces();
            if(interfaceList==null){
                System.out.println("No interface found");
            }else {
                while (interfaceList.hasMoreElements()){
                    NetworkInterface iface = interfaceList.nextElement();
                    System.out.println("Interface " + iface.getName());
                    Enumeration<InetAddress> addressList = iface.getInetAddresses();
                    if(!addressList.hasMoreElements()){
                        System.out.println("\tNo address for this interface");
                    }
                    while (addressList.hasMoreElements()){
                        InetAddress address = addressList.nextElement();
                        System.out.println("\tAddress "+(address instanceof Inet4Address?"v4":"v6")+":"+address.getHostAddress());
                    }
                }
            }
        }catch (SocketException se){
            System.out.println("error getting network interfaces:"+se.getMessage());
        }

        for(String host:args){
            try {
                System.out.println(host + ":");
                InetAddress[] addressList = InetAddress.getAllByName(host);
                for(InetAddress address:addressList){
                    System.out.println("\t"+address.getHostName()+"/"+address.getHostAddress());
                }
            }catch (UnknownHostException e){
                System.out.println("\t Unable to find address for "+host);
            }
        }
    }
}
