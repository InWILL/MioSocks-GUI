package main

import (
	"fmt"
	"os"

	"github.com/goccy/go-yaml"
)

type Profile struct {
	Proxies []map[string]any `yaml:"proxies"`
}

type ProfileList struct {
	URL      string `yaml:"url,omitempty"`
	Time     string `yaml:"time"`
	Name     string `yaml:"name"`
	Selected uint   `yaml:"selected,omitempty"`
}

type Config struct {
	Port     uint16        `yaml:"port,omitempty"`
	AllowLAN bool          `yaml:"allow-lan,omitempty"`
	Rule     string        `yaml:"rule,omitempty"`
	Profiles []ProfileList `yaml:"profiles"`
}

type MioService struct {
	config  Config
	profile Profile
	// service  service.MioService
}

func (m *MioService) GetProfiles() []string {
	data, err := os.ReadFile("settings.yaml")
	if err != nil {
		panic(err)
	}

	m.config = Config{}
	err = yaml.Unmarshal(data, &m.config)
	if err != nil {
		panic(err)
	}
	fmt.Println(m.config)

	result := make([]string, len(m.config.Profiles))
	for i, item := range m.config.Profiles {
		result[i] = item.Time
	}
	return result
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

// func (m *MioService) Start() {
// 	m.service, _ = service.NewService(
// 		service.MioOptions{
// 			Port: 2805,
// 			Proxy: map[string]any{
// 				"name": "Direct",
// 				"type": "direct",
// 			},
// 		})
// 	go m.service.Start()
// }

// func (m *MioService) UpdateProxy(index int) {
// 	m.service.UpdateProxy(m.profile.Proxies[index])
// }

// func (m *MioService) GetStream() {
// 	ticker := time.NewTicker(time.Second)
// 	for range ticker.C {
// 		UpStream := m.service.GetUpStream()
// 		DownStream := m.service.GetDownStream()
// 		app.Event.Emit("upstream-update", formatBytes(UpStream))
// 		app.Event.Emit("downstream-update", formatBytes(DownStream))
// 	}
// }

func formatBytes(bytes int64) string {
	const (
		KB = 1024
		MB = 1024 * KB
		GB = 1024 * MB
		TB = 1024 * GB
	)
	switch {
	case bytes >= TB:
		return fmt.Sprintf("%.2f TB", float64(bytes)/float64(TB))
	case bytes >= GB:
		return fmt.Sprintf("%.2f GB", float64(bytes)/float64(GB))
	case bytes >= MB:
		return fmt.Sprintf("%.2f MB", float64(bytes)/float64(MB))
	case bytes >= KB:
		return fmt.Sprintf("%.2f KB", float64(bytes)/float64(KB))
	default:
		return fmt.Sprintf("%d B", bytes)
	}
}
