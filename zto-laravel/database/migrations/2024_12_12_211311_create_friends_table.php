<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendsTable extends Migration
{
    public function up()
    {
        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Użytkownik inicjujący znajomość
            $table->unsignedBigInteger('friend_id'); // Użytkownik, który ma być znajomym
            $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');
            $table->timestamps();

            // Klucze obce
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('friend_id')->references('id')->on('users')->onDelete('cascade');

            // Unikalna relacja między użytkownikami
            $table->unique(['user_id', 'friend_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('friends');
    }
}

