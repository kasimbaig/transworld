import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ndchsa-admin';
    // Add these properties to manage the chatbot's state
  isChatbotOpen: boolean = false;
  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
  openChatbot() {
    console.log("click");
    this.isChatbotOpen = true;
  }

  closeChatbot(): void {
    this.isChatbotOpen = false;
  }

  minimizeChatbot(): void {
    this.isChatbotOpen = false; // For this simple example, we can treat minimize the same as close
  }
}
