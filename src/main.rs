use axum::{
    extract::Multipart,
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::{get, post},
    Router,
};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let app = Router::new()
        .route("/", get(index))
        .route("/upload", post(upload_file))
        .nest_service("/static", ServeDir::new("static"));
    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    axum::serve(listener, app).await
}

async fn index() -> impl IntoResponse {
    (StatusCode::OK, Html(include_str!("../public/index.html")))
}

async fn upload_file(mut multipart: Multipart) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        let bytes = field.bytes().await.unwrap();

        println!("Received: {name} with bytes: {bytes:?}");
    }
}
