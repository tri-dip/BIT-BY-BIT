import cv2
import numpy as np
from ultralytics import YOLO
import mediapipe as mp
import time
import threading

class FocusModel:
    def __init__(self):
       
        self.model = YOLO("yolov8n.pt")
        mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = mp_face_mesh.FaceMesh(
            refine_landmarks=True,
            max_num_faces=1
        )

       
        self.data = {
            "focus_score": 100,
            "head_state": "Forward",
            "eyes": "Open",
            "phone_detected": False,
            "timestamp": time.time()
        }

        
        thread = threading.Thread(target=self.run, daemon=True)
        thread.start()

    def get_head_direction(self, landmarks, w, h):
        left = landmarks[33]
        right = landmarks[263]
        nose = landmarks[1]

        cx = int(nose.x * w)
        left_x = left.x * w
        right_x = right.x * w

        if abs(left_x - cx) > 80:
            return "Looking Right"
        elif abs(right_x - cx) > 80:
            return "Looking Left"
        return "Forward"

    def eye_aspect_ratio(self, lms, eye):
        if eye == "left":
            ids = [33, 160, 158, 133, 153, 144]
        else:
            ids = [263, 387, 385, 362, 380, 373]

        pts = np.array([[lms[id].x, lms[id].y] for id in ids])
        A = np.linalg.norm(pts[1] - pts[5])
        B = np.linalg.norm(pts[2] - pts[4])
        C = np.linalg.norm(pts[0] - pts[3])
        return (A + B) / (2.0 * C)

    def run(self):
        cap = cv2.VideoCapture(0)
        last_blink = time.time()

        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            h, w = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

          
            results = self.model(frame, verbose=False)[0]
            phone_detected = any(int(det[5]) == 67 for det in results.boxes.data)

            mesh = self.face_mesh.process(rgb)
            head_state = "Unknown"
            eyes_open = True

            if mesh.multi_face_landmarks:
                lms = mesh.multi_face_landmarks[0].landmark

                head_state = self.get_head_direction(lms, w, h)

                left_ear = self.eye_aspect_ratio(lms, "left")
                right_ear = self.eye_aspect_ratio(lms, "right")
                avg_ear = (left_ear + right_ear) / 2

                eyes_open = avg_ear >= 0.19

                if not eyes_open:
                    last_blink = time.time()

          
            focus_score = 100
            if head_state != "Forward": focus_score -= 30
            if not eyes_open:          focus_score -= 40
            if phone_detected:         focus_score -= 50
            focus_score = max(0, min(100, focus_score))

            self.data = {
                "focus_score": focus_score,
                "head_state": head_state,
                "eyes": "Open" if eyes_open else "Closed",
                "phone_detected": phone_detected,
                "timestamp": time.time()
            }

        cap.release()

    def get_data(self):
        return self.data
