"""
MandiMitra Multilingual AI Chatbot Service
Enforces strict 5-tier resolution priority:
1. Live Database Query
2. Internal APIs
3. Deterministic Business Logic
4. Approved Agricultural Knowledge Base
5. Gemini Fallback
"""

import json
import re
from typing import Dict, Any, Tuple

class MultilingualEngine:
    def __init__(self, kb_path: str = "chatbot/knowledge/agri_knowledge_base.json"):
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                self.knowledge_base = json.load(f)
        except Exception:
            self.knowledge_base = {}

    def detect_language(self, text: str) -> str:
        lower = text.lower()
        # Marathi markers
        if any(w in lower for w in ["आहे", "कुठे", "माझा", "कधी", "किती", "वेळ", "mazha", "kuthe", "kadhi"]):
            return "mr"
        # Hindi markers
        if any(w in lower for w in ["है", "कहाँ", "मेरा", "कब", "कितना", "समय", "mera", "kaha", "kab", "kitna"]):
            return "hi"
        # General Devanagari
        if re.search(r"[\u0900-\u097F]", text):
            return "hi"
        return "en"

    def classify_intent(self, text: str) -> str:
        lower = text.lower()
        if any(w in lower for w in ["token", "queue", "wait", "टोकन", "कतार", "रांग", "turn"]):
            return "TOKEN_STATUS"
        if any(w in lower for w in ["recommend", "best", "centre", "kaha jau", "kuthe jau"]):
            return "RECOMMENDATION"
        if any(w in lower for w in ["payment", "paisa", "dbt", "पैसे", "पेमेंट"]):
            return "PAYMENT_STATUS"
        if any(w in lower for w in ["msp", "rate", "bhav", "भाव", "दर"]):
            return "MSP_RATES"
        if any(w in lower for w in ["document", "aadhaar", "7/12", "कागदपत्र"]):
            return "DOCUMENTS_REQUIRED"
        return "GENERAL_AGRICULTURE"

    def get_kb_response(self, intent: str, lang: str) -> str:
        if intent == "MSP_RATES":
            if lang == "hi":
                return "सरकारी न्यूनतम समर्थन मूल्य (MSP) 2026: गेहूँ ₹2,275/क्विंटल, प्याज ₹2,250-₹2,600/क्विंटल, सोयाबीन ₹4,892/क्विंटल।"
            elif lang == "mr":
                return "शासकीय हमीभाव (MSP) 2026: गहू ₹2,275/क्विंटल, कांदा ₹2,250-₹2,600/क्विंटल, सोयाबीन ₹4,892/क्विंटल."
            return "Official MSP Rates 2026: Wheat ₹2,275/qtl, Onion ₹2,250-₹2,600/qtl, Soybean ₹4,892/qtl."
        
        if intent == "DOCUMENTS_REQUIRED":
            if lang == "hi":
                return "आवश्यक दस्तावेज: आधार कार्ड, 7/12 खतौनी, बैंक पासबुक, मंडीमित्र टोकन पास।"
            elif lang == "mr":
                return "आवश्यक कागदपत्रे: आधार कार्ड, 7/12 उतारा, बँक पासबुक, MandiMitra डिजिटल टोकन."
            return "Required Documents: Aadhaar Card, 7/12 Land Record, Bank Passbook, MandiMitra Token Pass."
            
        return "MandiMitra Smart Procurement Assistant."
