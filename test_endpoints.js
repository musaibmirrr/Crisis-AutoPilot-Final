const testEndpoints = async () => {
  const baseURL = "http://localhost:3000";

  console.log("Starting API endpoint tests...");

  // 1. Test /api/questions
  try {
    const res = await fetch(`${baseURL}/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-test-bypass": "true" },
      body: JSON.stringify({ symptom: "severe headache for 2 days" })
    });
    console.log("[POST] /api/questions -> Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Error testing /api/questions:", e.message);
  }

  // 2. Test /api/triage
  try {
    const res = await fetch(`${baseURL}/api/triage`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-test-bypass": "true" },
      body: JSON.stringify({
        symptom: "severe headache for 2 days",
        answers: { "duration": "2 days", "severity": "8/10" }
      })
    });
    console.log("\n[POST] /api/triage -> Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Error testing /api/triage:", e.message);
  }

  // 3. Test /api/doctors
  try {
    const res = await fetch(`${baseURL}/api/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-test-bypass": "true" },
      body: JSON.stringify({ latitude: 37.7749, longitude: -122.4194 })
    });
    console.log("\n[POST] /api/doctors -> Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Error testing /api/doctors:", e.message);
  }

  // 4. Test /api/report/save
  try {
    const res = await fetch(`${baseURL}/api/report/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-test-bypass": "true" },
      body: JSON.stringify({
        symptomInput: "severe headache for 2 days",
        answers: { "duration": "2 days" },
        severity: "medium",
        structuredReport: {
          explanation: "Testing",
          possibleCauses: ["Stress"],
          immediateActions: ["Rest"],
          dietRecommendations: ["Water"],
          medications: ["Tylenol"],
          whenToSeekHelp: "If worse"
        }
      })
    });
    console.log("\n[POST] /api/report/save -> Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Error testing /api/report/save:", e.message);
  }

  // 5. Test /api/report/list
  try {
    const res = await fetch(`${baseURL}/api/report/list`, {
      method: "GET",
      headers: { "x-test-bypass": "true" }
    });
    console.log("\n[GET] /api/report/list -> Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Error testing /api/report/list:", e.message);
  }
};

testEndpoints();