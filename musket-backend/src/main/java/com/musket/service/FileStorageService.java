package com.musket.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String UPLOAD_DIR = "uploads/";

    public String uploadFile(MultipartFile file) throws IOException {
    	//only ensures that the folder exists. if not creates it
    	Files.createDirectories(Paths.get(UPLOAD_DIR));
        Path filePath = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
        Files.write(filePath, file.getBytes());
        return filePath.toString(); // Returns file path as image URL
    }
}
