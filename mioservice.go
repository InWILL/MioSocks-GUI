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
	Selected *uint  `yaml:"selected,omitempty"`
}

type Config struct {
	Port     *uint16       `yaml:"port,omitempty"`
	AllowLAN bool          `yaml:"allow-lan,omitempty"`
	Rule     *string       `yaml:"rule,omitempty"`
	Profiles []ProfileList `yaml:"profiles"`
	Selected *uint         `yaml:"selected,omitempty"`
}

type MioService struct {
	config  Config
	profile Profile
	rules   []string
	// service  service.MioService
}

func (m *MioService) GetPort() *uint16 {
	return m.config.Port
}

func (m *MioService) GetAllowLAN() bool {
	return m.config.AllowLAN
}

func (m *MioService) GetSelectedProfile() *uint {
	return m.config.Selected
}

func (m *MioService) GetSelectedProxy() *uint {
	if m.config.Selected == nil {
		return nil
	}
	return m.config.Profiles[*m.config.Selected].Selected
}

func (m *MioService) UpdateSelectedProfile(index *uint) {
	m.config.Selected = index
	//m.WriteProfiles()
}

func (m *MioService) UpdateSelectedProxy(index *uint) {
	i := *m.config.Selected
	m.config.Profiles[i].Selected = index
	//m.WriteProfiles()
}

func (m *MioService) WriteProfiles() {
	data, err := yaml.Marshal(&m.config)
	if err != nil {
		panic(err)
	}
	os.WriteFile("settings.yaml", data, 0644)
}

func (m *MioService) ReadProfiles() *uint {
	data, err := os.ReadFile("settings.yaml")
	if err != nil {
		panic(err)
	}

	m.config = Config{}
	err = yaml.Unmarshal(data, &m.config)
	if err != nil {
		panic(err)
	}
	return m.config.Selected
}

func (m *MioService) GetProfiles() []string {
	result := make([]string, len(m.config.Profiles))
	for i, item := range m.config.Profiles {
		result[i] = item.Time
	}
	return result
}

func (m *MioService) ReadProxies() *uint {
	if m.config.Selected == nil {
		return nil
	}
	index := *m.config.Selected
	file := m.config.Profiles[index].Time
	data, err := os.ReadFile("./profiles/" + file)
	if err != nil {
		panic(err)
	}

	m.profile = Profile{}
	err = yaml.Unmarshal(data, &m.profile)
	if err != nil {
		panic(err)
	}
	return m.config.Profiles[index].Selected
}

func (m *MioService) GetProxies() ([]string, []string) {
	name := make([]string, len(m.profile.Proxies))
	proto := make([]string, len(m.profile.Proxies))
	for i, item := range m.profile.Proxies {
		if result, ok := item["name"].(string); ok {
			name[i] = result
		} else {
			name[i] = ""
		}
		if result, ok := item["type"].(string); ok {
			proto[i] = result
		} else {
			proto[i] = ""
		}
	}
	return name, proto
}

func (m *MioService) ReadRules() {
	dir, err := os.ReadDir("./rules")
	if err != nil {
		panic(err)
	}

	m.rules = make([]string, len(dir))
	for i, file := range dir {
		m.rules[i] = file.Name()
	}
}

func (m *MioService) GetRules() []string {
	return m.rules
}

func (m *MioService) GetSelectedRule() *string {
	return m.config.Rule
}

func (m *MioService) ReadRule(name string) string {
	data, err := os.ReadFile("./rules/" + name)
	if err != nil {
		panic(err)
	}
	return string(data)
}

func (m *MioService) WriteRule(name string, content string) {
	os.WriteFile("./rules/"+name, []byte(content), 0644)
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
