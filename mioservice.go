package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/goccy/go-yaml"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type Rules struct {
	Domain  []string `json:"domain,omitempty"`
	Process []string `json:"process,omitempty"`
}

type MioOptions struct {
	Port  uint16         `json:"port"`
	Proxy map[string]any `json:"proxy"`
	Rules Rules          `json:"rules,omitempty"`
}

type Profile struct {
	Proxies []map[string]any `yaml:"proxies"`
}

type Rule struct {
	Process []string `yaml:"process"`
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
	// service service.MioService
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

func (m *MioService) DeleteRule(name string) {
	err := os.Remove("./rules/" + name)
	if err != nil {
		panic(err)
	}
}

func (m *MioService) ScanFolder() *string {
	selectedDir, _ := application.OpenFileDialog().
		CanChooseDirectories(true).
		CanChooseFiles(false).
		PromptForSingleSelection()
	if selectedDir != "" {
		dir, err := os.ReadDir(selectedDir)
		if err != nil {
			panic(err)
		}

		EXElist := Rule{}
		for _, file := range dir {
			name := file.Name()
			ext := filepath.Ext(name)
			if strings.ToLower(ext) == ".exe" {
				EXElist.Process = append(EXElist.Process, name)
			}
		}

		data, err := yaml.Marshal(EXElist)
		if err != nil {
			panic(err)
		}
		text := string(data)
		return &text
	} else {
		application.InfoDialog().SetMessage("No directory selected").Show()
	}
	return nil
}

func (m *MioService) ReadProfile(name string) string {
	data, err := os.ReadFile("./profiles/" + name)
	if err != nil {
		panic(err)
	}
	return string(data)
}

func (m *MioService) WriteProfile(name string, content string) {
	os.WriteFile("./profiles/"+name, []byte(content), 0644)
	m.config.Profiles = append(m.config.Profiles, ProfileList{
		Time: name,
		Name: name,
	})
	m.WriteProfiles()
}

func (m *MioService) DeleteProfile(index int) {
	name := m.config.Profiles[index].Time
	err := os.Remove("./profiles/" + name)
	if err != nil {
		panic(err)
	}
	m.config.Profiles = append(m.config.Profiles[:index], m.config.Profiles[index+1:]...)
	m.WriteProfiles()
}

// func (m *MioService) Start() {
// 	m.service, _ = service.NewService(
// 		service.MioOptions{
// 			Port: 2801,
// 			Proxy: map[string]any{
// 				"name": "Direct",
// 				"type": "direct",
// 			},
// 		})
// 	if m.config.Selected != nil {
// 		if m.config.Profiles[*m.config.Selected].Selected != nil {
// 			proxyIndex := *m.config.Profiles[*m.config.Selected].Selected
// 			m.service.UpdateProxy(m.profile.Proxies[proxyIndex])
// 		}
// 	}
// 	go m.service.Start()
// }

func (m *MioService) UpdateService(index *int) {
	if index != nil {
		// m.service.UpdateProxy(m.profile.Proxies[*index])
		options := MioOptions{
			Port:  2801,
			Proxy: m.profile.Proxies[*index],
		}
		data, _ := json.Marshal(options)
		req, err := http.Post(
			"http://localhost:62334/config",
			"application/json",
			bytes.NewBuffer(data),
		)
		if err != nil {
			panic(err)
		}
		defer req.Body.Close()
		fmt.Printf("Proxy updated: %d\n", req.StatusCode)
	}
}

func (m *MioService) DelayTest(index int) int64 {
	proxy := m.profile.Proxies[index]

	data, _ := json.Marshal(proxy)
	req, err := http.Post(
		"http://localhost:62334/delay",
		"application/json",
		bytes.NewBuffer(data),
	)
	if err != nil {
		panic(err)
	}
	defer req.Body.Close()

	var result struct {
		Delay int64 `json:"delay"`
	}
	json.NewDecoder(req.Body).Decode(&result)
	return result.Delay
}
