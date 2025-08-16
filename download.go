package main

import (
	"io"
	"net/http"
	"os"
)

func (m *MioService) DownloadConfig(url string, name string) bool {
	res, err := http.Get(url)
	if err != nil {
		return false
	}
	defer res.Body.Close()

	file, err := os.Create("./profiles/" + name)
	if err != nil {
		return false
	}
	defer file.Close()

	_, err = io.Copy(file, res.Body)
	return err != nil
}
