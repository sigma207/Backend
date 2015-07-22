package com.jelly.socket;

import com.jelly.pojo.Person;
import com.jelly.service.SocketService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ConnectException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Created by user on 2015/7/1.
 */
public class SocketThread implements Runnable {
    private SocketService service;

    public SocketThread(SocketService service) {
        this.service = service;
    }

    public void run(){
        Socket socket = null;
        ObjectOutputStream oos = null;
        ObjectInputStream ois = null;

        while (true){
            try {
                socket = new Socket(service.getHost().getHostName(), 9876);

                oos = new ObjectOutputStream(socket.getOutputStream());
                System.out.println("Sending request to Socket server");
                oos.writeObject("give me the value");

                ois = new ObjectInputStream(socket.getInputStream());
                int newValue = Integer.parseInt((String) ois.readObject());
                service.setCurrentValue(newValue);
                ois.close();
                oos.close();
                System.out.println("sleep 1000ms...1");
                Thread.sleep(3000);
                System.out.println("sleep 1000ms...2");
            }catch (Exception e){
                e.printStackTrace();
                if(e instanceof ConnectException){
                    System.out.println("wait 5000ms to reconnect");
                    try {
                        Thread.sleep(5000);
                    }catch (InterruptedException ie){
                        System.out.println();
                        break;
                    }
                }else{
                    break;
                }
            }

        }
    }
}
