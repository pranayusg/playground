import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  UserSignIn,
  userSignInBody,
  userSignInResponse,
} from '../signin/userSignin';
import {
  UserSignUp,
  userSignUpBody,
  userSignUpResponse,
} from '../signup/userSignup';
import { auth } from './authHelper';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private Url = 'http://localhost:4000';
  private Token = auth.getToken();

  constructor(private http: HttpClient) {}

  // Open Routes
  signUp(user: userSignUpBody): Observable<userSignUpResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.Url}/users`, user, { headers }).pipe(
      tap((data) => console.log('sign up: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  signIn(user: userSignInBody): Observable<userSignInResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.Url}/auth`, user, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  getQuotes(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.Url}/quote`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  getAuthors(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.get<any>(`${this.Url}/author`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  getAllTags(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.Url}/quote/alltags`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  getQuotesByTag(tag: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .get<any>(`${this.Url}/quote/search/searchtag/tag?tag=${tag}`, {
        headers,
      })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  // Protected Routes
  createQuotes(quote: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.post<any>(`${this.Url}/quote`, quote, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  searchQuotesByAuthor(author: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .get<any>(`${this.Url}/quote/search?author=${author}`, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  getMyfavQuotes(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .get<any>(`${this.Url}/quote/myfavquotes`, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  getMyUnfavQuotes(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .get<any>(`${this.Url}/quote/myunfavquotes`, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  likeUp(id: string): Observable<any> {
    console.log(this.Token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .patch<any>(`${this.Url}/quote/${id}/like/up`, {}, { headers })
      .pipe(
        tap((data) => {
          // console.log('likeUp : ' + JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
  }

  dislikeUp(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .patch<any>(`${this.Url}/quote/${id}/dislike/up`, {}, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  likeDown(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .patch<any>(`${this.Url}/quote/${id}/like/down`, {}, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  dislikeDown(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .patch<any>(`${this.Url}/quote/${id}/dislike/down`, {}, { headers })
      .pipe(
        // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
        catchError(this.handleError)
      );
  }

  editQuote(id: string): Observable<any> {
    //   let data;
    // let id = quotesData.id;
    // delete quotesData.id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.patch<any>(`${this.Url}/quote/${id}`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  deleteQuote(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.delete<any>(`${this.Url}/quote/${id}`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  updateUser(values: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.patch<any>(`${this.Url}/users`, values, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  getUserDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.get<any>(`${this.Url}/users`, { headers }).pipe(
      // tap((data) => {console.log('sign in : ' + JSON.stringify(data))}),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
