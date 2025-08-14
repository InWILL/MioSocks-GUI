package main

import (
	"encoding/json"
	"os"
)

type Profile struct {
	Url     string         `json:"url"`
	Proxies map[string]any `json:"proxies"`
}

type MioService struct {
	profiles []string
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

func (m *MioService) GetProxies(file string) []string {
	data, err := os.ReadFile(file)
	if err != nil {
		panic(err)
	}

	profile := &Profile{}
	err = json.Unmarshal(data, profile)
	if err != nil {
		panic(err)
	}

	name := make([]string, 1)
	if v, ok := profile.Proxies["name"].(string); ok {
		name[0] = v
	} else {
		name[0] = ""
	}
	return name
}
