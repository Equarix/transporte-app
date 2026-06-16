from __future__ import annotations

from typing import Any, Callable, Dict, Optional, Tuple, TypeVar

import requests

T = TypeVar("T")


def error_wrapper(fn: Callable[[], T]) -> Tuple[Optional[str], Optional[T]]:
    try:
        return None, fn()
    except Exception as error:  # noqa: BLE001 - mirrors TS broad catch
        print(error)
        parsed_error = str(error) or "Something went wrong"
        print(parsed_error)
        return parsed_error, None


class ChatwootSdk:
    def __init__(self, url: str, token: str, account_id: int = 1, timeout: int = 30) -> None:
        self.account_id = account_id
        self.timeout = timeout
        self.instance = requests.Session()
        self.instance.headers.update({"api_access_token": token})
        self.base_url = url.rstrip("/")

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def getTemplates(self) -> Optional[Dict[str, Any]]:
        error_template, template = error_wrapper(
            lambda: self.instance.get(
                self._url(f"accounts/{self.account_id}/inboxes"),
                timeout=self.timeout,
            ).json()
        )
        if error_template:
            return None
        return template

    def findContact(self, phone: str) -> Optional[Dict[str, Any]]:
        error, result = error_wrapper(
            lambda: self.instance.get(
                self._url(f"accounts/{self.account_id}/contacts/search"),
                params={"q": phone},
                timeout=self.timeout,
            ).json()
        )
        if error:
            return None
        return result

    def createContact(self, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        error_contact, result_contact = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/contacts"),
                json=payload,
                timeout=self.timeout,
            ).json()
        )
        if error_contact:
            return None
        return result_contact

    def getMessages(self, contact_id: int) -> Optional[Dict[str, Any]]:
        error_messages, result_messages = error_wrapper(
            lambda: self.instance.get(
                self._url(f"accounts/{self.account_id}/contacts/{contact_id}/conversations"),
                timeout=self.timeout,
            ).json()
        )
        if error_messages:
            return None
        return result_messages

    def createConversation(self, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        error_send, result_send = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations"),
                json=payload,
                timeout=self.timeout,
            ).json()
        )
        if error_send:
            return None
        return result_send

    def sendSingleMessage(self, payload: str, conversation_id: int) -> Optional[Dict[str, Any]]:
        error_send, result_send = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations/{conversation_id}/messages"),
                json={"content": payload},
                timeout=self.timeout,
            ).json()
        )
        if error_send:
            return None
        return result_send

    def sendSingleMessageWithFile(
        self,
        payload: str,
        conversation_id: int,
        file_url: str,
    ) -> Optional[Dict[str, Any]]:
        error_file, file_content = error_wrapper(
            lambda: self.instance.get(file_url, timeout=self.timeout).content
        )
        if error_file or file_content is None:
            return None

        files = {"attachments[]": ("file", file_content)}
        data = {"content": payload}

        error_send, result_send = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations/{conversation_id}/messages"),
                data=data,
                files=files,
                timeout=self.timeout,
            ).json()
        )
        if error_send:
            return None
        return result_send

    def sendMessageWithConversation(
        self,
        payload: Dict[str, Any],
        conversation_id: int,
    ) -> Optional[Dict[str, Any]]:
        error_send, result_send = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations/{conversation_id}/messages"),
                json=payload.get("message"),
                timeout=self.timeout,
            ).json()
        )
        if error_send:
            return None
        return result_send

    def sendMessage(self, body_create: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        error_send, result_send = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations"),
                json=body_create,
                timeout=self.timeout,
            ).json()
        )
        if error_send:
            return None
        return result_send

    def getConversation(self, conversation_id: int) -> Optional[Dict[str, Any]]:
        error_labels, result_labels = error_wrapper(
            lambda: self.instance.get(
                self._url(f"accounts/{self.account_id}/conversations/{conversation_id}"),
                timeout=self.timeout,
            ).json()
        )
        if error_labels:
            return None
        return result_labels

    def setLabels(self, conversation_id: int, labels: list[str]) -> Optional[Dict[str, Any]]:
        error_update_labels, result_update_labels = error_wrapper(
            lambda: self.instance.post(
                self._url(f"accounts/{self.account_id}/conversations/{conversation_id}/labels"),
                json={"labels": labels},
                timeout=self.timeout,
            ).json()
        )
        if error_update_labels:
            return None
        return result_update_labels

    def sendMessageWithContactLastConversation(
        self,
        contact: Dict[str, Any],
        payload: Dict[str, Any],
        inbox_id: int,
    ) -> Optional[Dict[str, Any]]:
        result_contact = self.findContact(contact["phone"])
        if not result_contact:
            return None

        contact_id: Dict[str, Any]
        if len(result_contact.get("payload", [])) == 0:
            payload_contact = {
                "name": contact["name"],
                "inbox_id": inbox_id,
                "source_id": contact["phone"],
                "phone_number": f"+51{contact['phone']}",
            }
            created_contact = self.createContact(payload_contact)
            if not created_contact:
                return None
            contact_id = {
                "id": created_contact["payload"]["contact"]["id"],
                "is_new": True,
            }
        else:
            contact_id = {
                "id": result_contact["payload"][0]["id"],
                "is_new": False,
            }

        result_messages = self.getMessages(contact_id["id"])
        if not result_messages:
            return None

        last_conversation = next(
            (
                conversation
                for conversation in result_messages.get("payload", [])
                if conversation.get("inbox_id") == int(inbox_id)
            ),
            None,
        )

        result_payload = {
            **payload,
            "contact_id": contact_id["id"],
            "inbox_id": inbox_id,
            "source_id": f"51{contact['phone']}",
        }

        if contact_id["is_new"] or not last_conversation:
            result_send = self.sendMessage(result_payload)
            if not result_send:
                return None
            return result_send

        result_send = self.sendMessageWithConversation(
            result_payload,
            last_conversation["id"],
        )
        if not result_send:
            return None
        return result_send