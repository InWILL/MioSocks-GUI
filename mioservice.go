package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Profile struct {
	Url     string           `json:"url"`
	Proxies []map[string]any `json:"proxies"`
}

type MioService struct {
	profiles []string
	profile  Profile
}

func (m *MioService) GetProfiles() []string {
	dir, err := os.ReadDir("./profiles")
	if err != nil {
		panic(err)
	}

	m.profiles = make([]string, len(dir))
	for i, e := range dir {
		m.profiles[i] = e.Name()
	}
	return m.profiles
}

func (m *MioService) GetProxies(file string) int {
	data, err := os.ReadFile("./profiles/" + file)
	if err != nil {
		panic(err)
	}

	m.profile = Profile{}
	err = json.Unmarshal(data, &m.profile)
	if err != nil {
		panic(err)
	}
	return len(m.profile.Proxies)
}

func (m *MioService) ParseProxies() []string {
	name := make([]string, len(m.profile.Proxies))
	for i, item := range m.profile.Proxies {
		if n, ok := item["name"].(string); ok {
			name[i] = n
		} else {
			name[i] = ""
		}
	}
	fmt.Println(name)
	return name
}
