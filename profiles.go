package main

import (
	"os"
)

type ProfileService struct{}

func (p *ProfileService) GetProfiles() []string {
	dir, err := os.ReadDir("./profiles")
	if err != nil {
		panic(err)
	}

	file := make([]string, len(dir))
	for i, e := range dir {
		file[i] = e.Name()
	}
	return file
}
