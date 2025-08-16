package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func (m *MioService) Download(url string, name string) string {
	res, err := http.Get(url)
	if err != nil {
		return fmt.Sprintf("Failed to download from url: %s", err)
	}
	defer res.Body.Close()

	file, err := os.Create("./profiles/" + name)
	if err != nil {
		return fmt.Sprintf("Failed to save profile file: %v", err)
	}
	defer file.Close()

	_, err = io.Copy(file, res.Body)
	if err != nil {
		return fmt.Sprintf("Failed to write file: %v", err)
	}
	return "Download successful"
}
