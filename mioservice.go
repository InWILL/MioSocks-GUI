package main

import (
	"fmt"
	"os"

	"github.com/InWILL/MioSocks/service"
	"github.com/goccy/go-yaml"
)

type Profile struct {
	Proxies []map[string]any `yaml:"proxies"`
}

type MioService struct {
	profiles []string
	profile  Profile
	service  service.MioService
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
	err = yaml.Unmarshal(data, &m.profile)
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

func (m *MioService) Start() {
	m.service, _ = service.NewService(
		service.MioOptions{
			Port: 2805,
			Proxy: map[string]any{
				"name": "Direct",
				"type": "direct",
			},
		})
	go m.service.Start()
}

func (m *MioService) UpdateProxy(index int) {
	m.service.UpdateProxy(m.profile.Proxies[index])
}
